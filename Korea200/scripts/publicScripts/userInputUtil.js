function saveWord(id, kWord, meaning) {
    const name = getUserName();
    if (name) {
        const data = {
            id: id,
            kWord: kWord,
            meaning: meaning,
            name: name
        };
        /*I use this method here because I dont want the page to reload*/
        fetch("/savingWord", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        alert(`${kWord} saved to ${name}'s`);
    }
}

function getSavedWord() {
    const name = getUserName();
    if (name) {
        document.getElementById("name").value = name;
        document.getElementById("headerForm").submit();
    }
}

function getUserName() {
    return prompt("What is your name?");
}