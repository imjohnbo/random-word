const dictionary = require('./dictionary_alpha_arrays.json');
const github = require('@actions/github');
const core = require('@actions/core');

const run = async function() {
    try {
        const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
        const letter = core.getInput('letter');
        const dictionaryFilteredByLetter = dictionary.filter(el => Object.keys(el)[0][0] === letter);

        if (!dictionaryFilteredByLetter.length) {
            throw new Error(`No letters found with letter: ${JSON.stringify(letter)}.`);
        }

        const words = Object.keys(dictionaryFilteredByLetter[0]);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomWordDefinition = dictionaryFilteredByLetter[0][randomWord];

        console.log('randomWord: ', randomWord);
        console.log('randomWordDefinition: ', randomWordDefinition);

        const newIssue = await octokit.issues.create({
            ...github.context.repo,
            title: `${letter} Word`,
            body: `**Word**: ${randomWord}\n**Definition**: ${randomWordDefinition}`,
            labels: [`${letter}`]
        });
    }
    catch (error) {
        console.log(error);
    }
}

run();