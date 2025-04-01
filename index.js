const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

const makePoemHTML = (poemData) => {
  const { title, author, lines } = poemData[0];

  const wrapInH2 = makeTag("h2");
  const wrapInH3 = makeTag("h3");
  const wrapInEm = makeTag("em");
  const wrapInP = makeTag("p");

  const formatTitle = wrapInH2(title);
  const formatAuthor = wrapInH3(wrapInEm(`by ${author}`));

  const formatStanzas = (lines) =>
    lines
      .reduce((stanzas, line) => {
        if (line === "") {
          stanzas.push([]);
        } else {
          stanzas[stanzas.length - 1].push(line);
        }
        return stanzas;
      }, [[]])
      .map(stanza => wrapInP(stanza.join("<br/>")))
      .join("");

  const formatPoem = pipe(formatStanzas, (stanzas) => `${formatTitle}${formatAuthor}${stanzas}`);

  return formatPoem(lines);
};

// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  // renders the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
