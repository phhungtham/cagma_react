/**
 * It takes a string of HTML and returns a React component
 * @returns The data is being parsed to html.
 */
import htmlReactParser from 'html-react-parser';

const parserDataToHtml = data => {
  if (data) {
    return htmlReactParser(data);
  }
};

export default parserDataToHtml;
