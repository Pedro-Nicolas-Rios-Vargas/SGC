import React, { useEffect, useRef, useState, useContext, useCallback } from 'react'
import getReportesU from '../helpers/usuarioReporte/getReportesU.js';
import getOneAsignan from '../helpers/Asignan/getOneAsignan.js';
import getOneRepirte from '../helpers/Reportes/getOneReporte.js';
import getAllCarrera from '../helpers/Carreras/getAllCarrera.js';
import getAllMaterias from '../helpers/Materias/getAllMaterias.js';
import { AuthContext } from "../helpers/Auth/auth-context.js";
import Loader from '../Loader.js';
import _ from 'lodash';
import postReportes from '../helpers/usuarioReporte/postReportes.js';
import putGeneran from '../helpers/usuarioReporte/putGeneran.js';

export const Reportes = () => {
    let auth = useContext(AuthContext);

    const reference = useRef(null);

    const [reportes, setReportes] = useState([]);// reportes son todos los reportes que se generaron
    const [selReporte, setSelReporte] = useState(null);// selReporte es el reporte seleccionado para la vista
    const [asignan, setAsignan] = useState([]);// asignan son todas las asignan que se generaron
    const [reporteName, setReporteName] = useState([]);// reporte que es uno individual para los titulos
    const [loading, setLoading] = useState(true);
    const [reportesFiltrados, setReportesFiltrados] = useState([]);// reportesFiltrados son los reportes filtrados
    const [idsReportes, setIdsReportes] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [selMateria, setSelMateria] = useState({
        index: null,
        ID_Asignan: null,
        ID_Reporte: null,
        ID_Generacion: null,
    });


    const [files, setFiles] = useState('');
    const [filesTamano, setFilesTamano] = useState(true);
    const [fileProgeso, setFileProgeso] = useState(false);
    const [fileResponse, setFileResponse] = useState(null);

    const uploadFileHandler = (e) => {
        setFiles(e.target.files);

    }
    const uploadFile = async (formData) => {
        setFileProgeso(true);
        await postReportes(auth.user.token, formData)
            .then(res => {
                setFileResponse(res);
                setFileProgeso(false);
            })
    }


    const fileSummit = async (e) => {
        e.preventDefault();
        // setFilesTamano(true);
        // setFileProgeso(true);
        // setFileResponse(null);
        setLoading(true)
        const formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append("Path_PDF", files[i]);
            formData.append("ID_Generacion", selMateria.ID_Generacion);
            await uploadFile(formData);
        }
        // for (var key of formData.entries()) {
        //     uploadFile(key)
        //     console.log(key[0] + ',' + key[1]);
        // }
        //Aqui hacer el fech para mandar los archivos?
        //setFormData(formData);
        console.log(selMateria.ID_Generacion)
        await putGeneran(auth.user.token, selMateria.ID_Generacion);
        setLoading(false);
        
    }

    const FilesShow = (props) => {
        let mensaje = [];
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                mensaje = mensaje.concat(
                    <div className='archivo'>
                        <p className='archivoP' key={i}>{files[i].name}</p>
                    </div>
                );
            }
            return mensaje;
        }
        return null;
    }

    /**
     * useEffect para obtener las materias
     */

    useEffect(() => {
        const getMaterias = async () => {
            await getAllMaterias(auth.user.token).then(res => {
                setMaterias(res);
            });
        }
        const getCarreras = async () => {
            await getAllCarrera(auth.user.token).then(res => {
                setCarreras(res);
            });
        }
        getMaterias();
        getCarreras();
    }, []);
    /**
     *  Funcion para obtener todos los reportes que se le asgino al maestro
     */
    const getReporte = useCallback(
        async () => {
            await getReportesU(auth.user.token).then(res => {
                setReportes(res);
            });
        },
        [],
    )

    /**
     * Funcion para obtener los asginan del maestro
     */
    const getAsignan = useCallback(
        async (id) => {
            await getOneAsignan(auth.user.token, id).then(res => {
                setAsignan(arrays => [...arrays, res]);
            });
        },
        [],
    )

    /**
     * Funcion para obtener los reportes individuales
     */
    const getReporteName = useCallback(
        async (id) => {
            await getOneRepirte(auth.user.token, id).then(res => {
                setReporteName(arrays => [...arrays, res]);
            });
        },
        [],
    )
    /**
     * Funcnion para obtener los ids de los reportes
     */
    const setIds = reportes.map(reporte => reporte.ID_Reporte);

    const setIdsAsignan = reportes.map(reportes => reportes.ID_Asignan);

    /**
     * Useeffect para obtener los reportes
     */
    useEffect(() => {
        getReporte();
    }, [getReporte]);

    /**
     * Useeffect para almacenar los datos a precentar
     */
    useEffect(() => {
        if (reportes.length > 0) {
            let array = setIds;
            let arrayAsignan = setIdsAsignan;
            let arrayAsignan2 = [];
            let array2 = [];
            array2 = array.filter(function (item, pos) {
                return array.indexOf(item) === pos;
            })
            arrayAsignan2 = arrayAsignan.filter(function (item, pos) {
                return arrayAsignan.indexOf(item) === pos;
            })
            array2.map(async (id) => {
                await getReporteName(id);
            })
            arrayAsignan2.map(async (id) => {
                await getAsignan(id);
            });
            setLoading(false);
        }
    }, [reportes]);

    const filtrarReportes = (index) => {
        setSelReporte(reporteName[index]);
        let array = reportes.filter(reporte => (reporte.ID_Reporte === reporteName[index].ID_Reporte));
        setReportesFiltrados(array)
        setSelMateria({
            ...selMateria,
            ID_Asignan: array[index].ID_Asignan,
            ID_Generacion: array[index].ID_Generacion,
            ID_Reporte: array[index].ID_Reporte,
            index: index
        });
    }
    const TituloMateria = () => {
        let titulo;
        if (selMateria.ID_Asignan !== null) {
            let grado = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].Grado;
            let grupo = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].Grupo;
            let ID_Materia = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].ID_Materia;
            let ID_Carrera = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].ID_Carrera;
            let nombreMateria = materias.filter(materia => (materia.ID_Materia === ID_Materia))[0].Nombre_Materia;
            let NombreCarrera = carreras.filter(carrera => (carrera.ID_Carrera === ID_Carrera))[0].Nombre_Carrera;
            titulo = (
                <h3>
                    {NombreCarrera + "\t" + nombreMateria + "\t" + grado + "\t" + grupo}
                </h3>
            );
        }
        return titulo
    }

    const siguiente = () => {
        if (selMateria.index < reportesFiltrados.length - 1) {
            setFiles("");
            setSelMateria({
                ...selMateria,
                index: selMateria.index + 1,
                ID_Asignan: reportesFiltrados[selMateria.index + 1].ID_Asignan,
                ID_Reporte: reportesFiltrados[selMateria.index + 1].ID_Reporte,
                ID_Generacion: reportesFiltrados[selMateria.index + 1].ID_Generacion,
            });
        } else {
            console.log("termino")
        }
    }

    const anterior = () => {
        if (selMateria.index > 0) {
            setFiles("");
            setSelMateria({
                ...selMateria,
                index: selMateria.index - 1,
                ID_Asignan: reportesFiltrados[selMateria.index - 1].ID_Asignan,
                ID_Reporte: reportesFiltrados[selMateria.index - 1].ID_Reporte,
                ID_Generacion: reportesFiltrados[selMateria.index - 1].ID_Generacion,
            });
        } else {
            console.log("terminoAtras")
        }
    }
    return (
        <>
            {loading === false ?
                (<>
                    {Object.keys(reportes).length !== 0 ? <>
                        <div className='reportesUser-Container'>
                            <div className='listReportes'>
                                <ul>
                                    {Object.keys(reporteName).length !== 0 ? reporteName.map((reporte, index) => {
                                        return (
                                            <li key={index}>
                                                <div className='listReportes__Reporte'
                                                    onClick={() => { filtrarReportes(index) }}>
                                                    {reporte.Nombre_Reporte}
                                                </div>
                                            </li>
                                        )
                                    }) :
                                        <>
                                        </>}
                                </ul>
                            </div>
                            <div className='cabeceraReportes'>
                                {selReporte !== null ?
                                    <>
                                        <h1 className='reportesUsuario'>{selReporte.Nombre_Reporte}</h1>
                                        <hr />
                                        <p className='reportesUsuario'>{selReporte.Descripcion}</p>

                                    </> : <></>}
                            </div>
                            <div className='subirArchivos'>
                                {selMateria.index !== null ?
                                    <>
                                        <div className='subirArchivos__module'>
                                            <TituloMateria />
                                            <hr />
                                            <div className='fileUploadU-grid'>
                                                <div className='fileUpload'>
                                                    <div className="file-uploadU">
                                                        <p className='subidor__pU'>Soltar archivo(s)</p>
                                                        <div className='subidorU'>
                                                            <input
                                                                id={"index"}
                                                                accept=".pdf"
                                                                type="file"
                                                                onChange={uploadFileHandler}
                                                                className="file-uploadU__input"
                                                                multiple />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='listFile'>
                                                    <div className='fileNames-containerU'>
                                                        <FilesShow />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={fileSummit}
                                            >Enviar</button>
                                        </div>
                                        <div className='buttons_selector'>
                                            <button id="anterior" onClick={anterior}>Anterior</button>
                                            <button id="anterior" onClick={siguiente}>Siguiente</button>
                                        </div>
                                    </> : <></>}
                            </div>
                        </div>
                    </> :
                        <>
                            <div className='imagen'>
                                <img src={"https://i.ytimg.com/vi/yzPiayo3Dic/mqdefault.jpg"} alt="loading" />
                                <h3 className='pito'>Sin nada que hace hijodesuchingadamadre</h3>

                            </div>
                        </>}
                </>) :
                (<>
                    <Loader />
                </>)}


        </>
    )
}
