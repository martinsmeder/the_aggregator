fetch("https://rss-to-json-serverless-api.vercel.app/api?feedURL=https://openai.com/blog/rss.xml").then((e=>e.json())).then((e=>{console.log(e);const t=e.items[0];document.getElementById("article-title").textContent=t.title,document.getElementById("article-description").textContent=t.description,document.getElementById("article-date").textContent=new Date(t.published).toLocaleDateString()})).catch((e=>{console.error("An error occurred:",e)}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiQUFTQUEsTUFIZSw2RkFJWkMsTUFBTUMsR0FBYUEsRUFBU0MsU0FDNUJGLE1BQU1HLElBQ0xDLFFBQVFDLElBQUlGLEdBR1osTUFBTUcsRUFBT0gsRUFBS0ksTUFBTSxHQUd4QkMsU0FBU0MsZUFBZSxpQkFBaUJDLFlBQWNKLEVBQUtLLE1BQzVESCxTQUFTQyxlQUFlLHVCQUF1QkMsWUFDN0NKLEVBQUtNLFlBQ1BKLFNBQVNDLGVBQWUsZ0JBQWdCQyxZQUFjLElBQUlHLEtBQ3hEUCxFQUFLUSxXQUNMQyxvQkFBb0IsSUFFdkJDLE9BQU9DLElBQ05iLFFBQVFhLE1BQU0scUJBQXNCQSxFQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGhlX2FnZ3JlZ2F0b3IvLi9zcmMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vb3BlbmFpLmNvbS9ibG9nL3Jzcy54bWxcbi8vIGh0dHBzOi8vd3d3LmRlZXBtaW5kLmNvbS9ibG9nL3Jzcy54bWxcbi8vIGh0dHBzOi8vbmV3cy5taXQuZWR1L3RvcGljL21pdG1hY2hpbmUtbGVhcm5pbmctcnNzLnhtbFxuLy8gQVBJOiBhcG5ld3MsIGJiY1xuXG5jb25zdCByc3NGZWVkVXJsID0gXCJodHRwczovL29wZW5haS5jb20vYmxvZy9yc3MueG1sXCI7XG5jb25zdCBhcGlVcmwgPSBgaHR0cHM6Ly9yc3MtdG8tanNvbi1zZXJ2ZXJsZXNzLWFwaS52ZXJjZWwuYXBwL2FwaT9mZWVkVVJMPSR7cnNzRmVlZFVybH1gO1xuXG4vLyBNYWtlIHRoZSBHRVQgcmVxdWVzdCB0byB0aGUgQVBJXG5mZXRjaChhcGlVcmwpXG4gIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAudGhlbigoZGF0YSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgLy8gQXNzdW1pbmcgZGF0YS5pdGVtcyBpcyBhbiBhcnJheSBvZiBhcnRpY2xlc1xuICAgIGNvbnN0IGl0ZW0gPSBkYXRhLml0ZW1zWzBdOyAvLyBTZWxlY3QgdGhlIGZpcnN0IGl0ZW0gZm9yIGV4YW1wbGVcblxuICAgIC8vIFNldCBhcnRpY2xlIHRpdGxlLCBhdXRob3IsIGRhdGUsIGFuZCBjb250ZW50XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpY2xlLXRpdGxlXCIpLnRleHRDb250ZW50ID0gaXRlbS50aXRsZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFydGljbGUtZGVzY3JpcHRpb25cIikudGV4dENvbnRlbnQgPVxuICAgICAgaXRlbS5kZXNjcmlwdGlvbjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFydGljbGUtZGF0ZVwiKS50ZXh0Q29udGVudCA9IG5ldyBEYXRlKFxuICAgICAgaXRlbS5wdWJsaXNoZWRcbiAgICApLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICB9KVxuICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihcIkFuIGVycm9yIG9jY3VycmVkOlwiLCBlcnJvcik7XG4gIH0pO1xuIl0sIm5hbWVzIjpbImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiaXRlbSIsIml0ZW1zIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInRleHRDb250ZW50IiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsIkRhdGUiLCJwdWJsaXNoZWQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJjYXRjaCIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==