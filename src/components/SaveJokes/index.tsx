import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'

import { GlobalContext } from '../../context/globalContext'
import { typeOfMultipleJokesObjects } from '../../Interfaces/index'
import { API_KEY } from '../../constant'

const AnchorStyles = styled.a`
	&.disabled {
		background-color: #f5f6f8;
		color: #34394f;
		pointer-events: none;
		cursor: not-allowed;
	}
`

const SaveJokes = () => {
	const { state, dispatch } = useContext(GlobalContext)
	const { numberOfJokesToSave, jokesToSave } = state
	const [ downloadLink, setDownloadLink ] = useState('')
	const textToSave = jokesToSave.value.map((el: typeOfMultipleJokesObjects) => el.joke)

	const makeTextFile = () => {
		//Put every single joke in a new line.
		const data = new Blob([ textToSave.join('\n') ], { type: 'text/plain' })

		if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink)
		setDownloadLink(window.URL.createObjectURL(data))
	}

	function fetchJokesToSave() {
		axios(`${API_KEY}/${numberOfJokesToSave}`).then((results) => {
			dispatch({
				type: 'FETCH_MULTIPLE_JOKES',
				payload: results.data
			})
		})
	}

	useEffect(
		() => {
			makeTextFile()
			fetchJokesToSave()
		},
		// eslint-disable-next-line
		[ numberOfJokesToSave ]
	)

	return (
		<AnchorStyles
			// this attribute sets the filename
			download='list.txt'
			// link to the download URL
			href={downloadLink}
			className={numberOfJokesToSave <= 0 || numberOfJokesToSave > 100 ? 'disabled' : ''}>
			Save Jokes
		</AnchorStyles>
	)
}

export default SaveJokes
