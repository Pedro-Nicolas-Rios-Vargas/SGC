const putCarrera = async (dataPost, id) => {
    const post = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            Nombre_Carrera: dataPost
        })
    };
    console.log("dataPost",dataPost)
    console.log("id", id)
    console.log(post)
    const res = await fetch('http://localhost:8000/materia/update-carrera/'+ id, post);
    const result = res.statusText;
    return result;
}
export default putCarrera