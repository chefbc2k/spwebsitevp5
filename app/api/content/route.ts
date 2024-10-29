import { NextResponse, NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    if (!type) {
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 });
    }

    let content;
    const contentPath = path.join(process.cwd(), 'content');

    switch (type) {
      case 'faq':
        const faqData = await fs.readFile(path.join(contentPath, 'faq/entries.json'), 'utf-8');
        content = JSON.parse(faqData);
        if (category) {
          content = content[category] || [];
        }
        break;

      case 'help':
        if (!slug) {
          const guides = await fs.readdir(path.join(contentPath, 'help/guides'));
          content = guides.map(async guide => {
            const fileContent = fs.readFile(
              path.join(contentPath, 'help/guides', guide),
              'utf-8'
            );
            const { data } = matter(await fileContent);
            return {
              slug: guide.replace('.mdx', ''),
              ...data,
            };
          });
        } else {
          const fileContent = await fs.readFile(
            path.join(contentPath, 'help/guides', `${slug}.mdx`),
            'utf-8'
          );
          const { data, content: mdxContent } = matter(fileContent);
          content = { ...data, content: mdxContent };
        }
        break;

      case 'legal':
        if (!slug) {
          return NextResponse.json({ error: 'Legal document slug is required' }, { status: 400 });
        }
        const legalContent = await fs.readFile(
          path.join(contentPath, 'legal', `${slug}.mdx`),
          'utf-8'
        );
        const { data, content: mdxContent } = matter(legalContent);
        content = { ...data, content: mdxContent };
        break;

      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
