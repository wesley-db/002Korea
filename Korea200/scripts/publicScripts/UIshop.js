export const subHeader = 
    `<header class='defaultHeader subHeader'>
        <a href='/' id='homeLink' class='headerDefaultFont defaultHomeLink'>
			Korea200
		</a>
		<form id="headerForm" method="post" action="/record">
			<input type="text" id="name" name="name">
			<input 
				type='button' 
				class='headerDefaultFont defaultSaveLink'
				value="Saved Words"
				onclick='getSavedWord()'
			>
		</form>
	</header>`;

export function searchBar(value) {
	return `<form action='/search' method='get'>
		<input
			type='text' 
			value='${value}'
			placeholder='Please type a korean word.'
			name='kWord'
			class='inputDefault defaultTextBar'>
		<input 
			type='submit'
			value='Search' 
			id='submitButton' 
			class='inputDefault defaultButton'>
    </form>`;
}

export function getHTMLlist(array, style) {
	const data = array.reduce((prev,curr) => `${prev}<li>${curr}</li>`, ``);
	return `<ul class="${style}">${data}</ul>`;
}

export function getOneCard(data) {
	const {id, kWord, meaning, audio, examples} = data;
	return `<div class="card">
				<div class="cardHeader">
					<p class="cardTitle">${kWord}</p>
					<div class="cardXtraInfo">
						<a href="${audio}" target="_blank" rel="noopener noreferrer" class="cardXtraInfoFont">
							pronunciation
						</a>
						<p class="cardXtraInfoFont">
							Source: National Institute of Korean Language (국립국어원)'s Basic/Learner's Dictionary
						</p>
					</div>
					<input type="button" value="Save" id="cardButton" onclick="saveWord('${id}','${kWord}','${meaning}')">
				</div>
				<p class="cardSubtitle">Meaning<p>
				${getHTMLlist(meaning, "listFont")}
				<p class="cardSubtitle">Examples</p>
				${getHTMLlist(examples, "listFont")}
				<hr>
				<a  
					href="https://papago.naver.com/?sk=ko&tk=en&st=${kWord}" 
					target="_blank" 
					rel="noopener noreferrer"
					class="cardFooterFont"
				>
					Check Papago's Translation
				</a>
				<a 
					href="https://translate.google.com/?sl=ko&tl=en&op=translate&text=${kWord}"
					target="_blank" 
					rel="noopener noreferrer"
					class="cardFooterFont"
				>
					Check Google Translate's Translation
				</a>
			</div>`;
}

export function getCards(dataList) {
	return dataList.reduce((prev, curr) => `${prev} ${getOneCard(curr)}`, ``);
}

export function getBigMssg(mssg) {
	return `<div class="bigMssg">${mssg}</div>`;
}

export function getTable(data) {
	const head = 
		`<thead>
			<tr>
				<th class="tableDefaultFont">단어</th>
				<th class="tableDefaultFont">뜻</th>
			<tr>
		</thead>`;
	const body = data.reduce((prev, curr) => 
		`${prev}
		<tr class="tableDefaultFont">
			<td>
				<a href='/search?kWord=${curr.kWord}' class="tableDefaultFont">
					${curr.kWord}
				</a>
			</td>
			<td class=" listFont tableDefaultFont">${getHTMLlist(curr.meaning)}</td>
		</tr>`, 
		``
	);
	return `<table class="table">${head}<tbody>${body}</tbody></table>`;
}