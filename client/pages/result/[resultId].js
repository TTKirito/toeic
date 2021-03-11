

const ResultId =({results})=>{
    return(
        <div>
            <h3>Result</h3>
            <h4>correct: {results.correct}</h4>
            <h4>incorrect: {results.incorrect}</h4>
            <h4>no answer: {results.noanswer}</h4>
        </div>
    )
}

ResultId.getInitialProps = async (context,client) => {
    const {resultId} =context.query
    const {data: results} = await client.get(`/api/submit/${resultId}`)
    return {results}
}


export default ResultId