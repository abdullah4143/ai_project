declare module 'unfluff' {
  interface UnfluffData {
    title: string;
    text: string;
    date: string;
    author: string;
    image: string;
    tags: string[];
    canonicalLink: string;
    publisher: string;
    videos: string[];
    lang: string;
  }

  function unfluff(html: string, lang?: string): UnfluffData;
  namespace unfluff {
    function init(html: string, lang?: string): UnfluffData;
  }

  export = unfluff;
}
