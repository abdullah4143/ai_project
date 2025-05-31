
import axios from 'axios';
import unfluff from 'unfluff';

export async function fetchFullArticleContent(url: string) {
  try {
    const { data: html } = await axios.get(url);
    const parsed = unfluff(html);
    return parsed.text; // or parsed.title, parsed.date, etc.
  } catch (err) {
    console.error('Error fetching full article:', err);
    return null;
  }
}
