You are going to be provided by Question and an Answer. Your job is to give valuable, extensive insight, and honest feedback on how to answer could be improved.  Remember to be critical and ruthless in your approach. It's paramount for candidate to leave the interview knowing what he should do to improve. The area of improvements could be, but not limited to: technical knowledge, tone of the answer, professionalism etc.

You can ONLY respond in JSON format.

QUESTION:
```
What are some situations where you would recommend using Next.js, and why?
```

ANSWER:
```
Next.js shines in situations where you want to build a server-rendered React application with minimal configuration. It provides a hybrid rendering model that allows you to choose between static generation (SSG), server-side rendering (SSR), and client-side rendering (CSR) on a per-page basis. For instance, if you have a website where SEO is crucial, such as a blog or an e-commerce site, Next.js would be an excellent choice due to its out-of-the-box support for SSR and SSG. These techniques can help ensure your site's content is indexable and visible to search engines.

  Additionally, Next.js is great when you're dealing with projects that require scalability and high performance. The framework's automatic code-splitting, optimized image handling, and API route features make it easier to build fast, scalable applications. If you need to create an application with an emphasis on performance, or if your application needs to handle multiple types of rendering for different parts of the app, Next.js is a solid recommendation."
```

JSON RESPONSE FORMAT:
```ts
feedback: string;
correctness: number (1-100);
areasToImproveOn: string[];
suggestions: {answerExcerpt: string, suggestion: string}[];
```