import yaml from 'js-yaml';
import { format } from 'date-fns';

export interface ClipData {
    title: string;
    url: string;
    author?: string;
    published?: string; // YYYY-MM-DD
    description?: string;
    tags?: string[];
    content?: string;
}

export const generateMarkdown = (data: ClipData): string => {
    const frontmatter = {
        title: data.title,
        source: data.url,
        author: data.author ? [[`[[${data.author}]]`]] : undefined, // Format as [[Author]]
        published: data.published || format(new Date(), 'yyyy-MM-dd'),
        created: format(new Date(), 'yyyy-MM-dd'),
        description: data.description || '',
        tags: data.tags || ['clippings'],
    };

    // Clean undefined values
    Object.keys(frontmatter).forEach(key =>
        (frontmatter as any)[key] === undefined && delete (frontmatter as any)[key]
    );

    // Fix author array format if needed, js-yaml handles arrays well but we want specific formatting
    // Actually js-yaml will output:
    // author:
    //   - "[[Author]]"
    // which matches the requirement.

    const yamlStr = yaml.dump(frontmatter, { lineWidth: -1, quotingType: '"' });

    return `---\n${yamlStr}---\n\n${data.content || ''}`;
};
