export default (str: TemplateStringsArray): string => str[0].replace(/\n/g, '').replace(/ +/g, ' ');
