const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);


const getHeadlines = async() => {
    try {
        const response = await newsapi.v2.topHeadlines({
        // category: 'headlines',
        language: 'en',
        pageSize: 7 // Set the desired page size
        });
        // console.log(response); // log the response to the console
        return response;

        } catch (error) {

        console.error('Error fetching news sources:', error);
        return { error: 'Failed to fetch news sources' };
        // res.status(500).json({ error: 'Failed to fetch news sources' });
    }
}

const getArticlesByCategory = async(category) =>{
     try {
        const response = await newsapi.v2.topHeadlines({
        category: category,
        language: 'en',
        pageSize: 10 // Set the desired page size

        });
        // console.log(response); // log the response to the console
        return response;

        } catch (error) {
        console.error('Error fetching news sources:', error);
        return { error: 'Failed to fetch news sources' };
        // res.status(500).json({ error: 'Failed to fetch news sources' });
    }
}
const getLimitArticlesByCategory = async(category, pagesize) =>{
     try {
        const response = await newsapi.v2.topHeadlines({
        category: category,
        language: 'en',
        pageSize: pagesize // Set the desired page size

        });
        // console.log(response); // log the response to the console
        return response;

        } catch (error) {
        console.error('Error fetching news sources:', error);
        return { error: 'Failed to fetch news sources' };
        // res.status(500).json({ error: 'Failed to fetch news sources' });
    }
}


module.exports = {getHeadlines, getArticlesByCategory, getLimitArticlesByCategory};
