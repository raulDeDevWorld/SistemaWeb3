import { useRouter } from 'next/router'
import Image from 'next/image'
import { useReducer, useState } from 'react'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'
import ReactPDF from '@react-pdf/renderer';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


import style from '../styles/CotizacionTerrestre.module.css'
import Button from '../components/Button'


function CotizacionTerrestre() {
    const { user, pdfData, setUserPdfData } = useUser()
    const router = useRouter()
 
    const [tarifa, setTarifa] = useState([""])
    const [otrosGastos, setOtrosGastos] = useState([""])
    const [incluye, setIncluye] = useState([""])

    const [calc, setCalc] = useState({})

    function handleEventChange(e) {
        setUserPdfData({ ...pdfData, ...{ [e.target.name]: e.target.value } })
    }
    function handlerCounter(word) {
        const newTarifa = tarifa.map(i => i)
        newTarifa.pop()
        word == "pluss" ? setTarifa([...tarifa, ...[""]]) : setTarifa(newTarifa)
    }
    function handlerCounterTwo(word) {
        const newTarifa = otrosGastos.map(i => i)
        newTarifa.pop()
        word == "pluss" ? setOtrosGastos([...otrosGastos, ...[""]]) : setOtrosGastos(newTarifa)
    }
    function handlerCounterThree(word) {
        const newIncluye = incluye.map(i => i)
        newIncluye.pop()
        word == "pluss" ? setIncluye([...incluye, ...[""]]) : setIncluye(newIncluye)
    }

    function handlerPdfButton() {
        router.push("/PdfView")
    }



    function handlerCalc(e, index) {

        if (e.target.name == `CANTIDADFLETE${index}` && calc[`FLETEUNITARIO${index}`] !== undefined) {
            let object = reducer(e, index, 'FLETEUNITARIO', 'PRODUCTFLETE', 'FLETETOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        if (e.target.name == `FLETEUNITARIO${index}` && calc[`CANTIDADFLETE${index}`] !== undefined) {
            let object = reducer(e, index, 'CANTIDADFLETE', 'PRODUCTFLETE', 'FLETETOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        if (e.target.name == `CANTIDAD${index}` && calc[`COSTOUNITARIO${index}`] !== undefined) {
            let object = reducer(e, index, 'COSTOUNITARIO', 'PRODUCT', 'TOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        if (e.target.name == `COSTOUNITARIO${index}` && calc[`CANTIDAD${index}`] !== undefined) {
            let object = reducer(e, index, 'CANTIDAD', 'PRODUCT', 'TOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        let object = {
            [e.target.name]: e.target.value,

        }
        setCalc({ ...calc, ...object })
    }


    function reducer (e, index, counter, prod, total) {
        let product = e.target.value * calc[`${counter}${index}`]

        let data = {
            ...calc,
            [e.target.name]: e.target.value,
            [`${prod}${index}`]: product,
        }

        let arr = Object.entries(data)

        let red = arr.reduce((ac, i) => {
            let str = i[0]
            if (str.includes(total)) {
                return ac
            }
            if (prod == 'PRODUCT' && str.includes('PRODUCTFLETE')) {
                return ac
            }
            let res = str.includes(prod)
            let r = res ? i[1] + ac : ac
            return r
        }, 0)

        let object = {
            [e.target.name]: e.target.value,
            [`${prod}${index}`]: product,
            PRODUCTOFLETETOTAL: prod === 'PRODUCTFLETE' ? red : data['PRODUCTOFLETETOTAL'],
            PRODUCTOTOTAL: prod === 'PRODUCT' ? red : data['PRODUCTOTOTAL'],
        }
        return object
    }

    console.log(calc)

    return (
        <Layout>
            <div className={style.container}>
                <form className={style.form}>
                    <div className={style.subtitle}>COTIZACIÓN TRANSPORTE TERRESTRE</div>
                    <div className={style.containerFirstItems}>
                        <div className={style.imgForm}>
                            <Image src="/logo.svg" width="250" height="150" alt="User" />
                        </div>
                        <div className={style.firstItems}>
                            <div>
                                <label htmlFor="">COTIZACIÓN No</label>
                                <input type="text" name={"COTIZACIÓN No"} onChange={handleEventChange} />
                            </div>
                            <div>
                                <label htmlFor="">FECHA</label>
                                <input type="text" name={"FECHA"} onChange={handleEventChange} />
                            </div>
                            <div>
                                <label htmlFor="">VALIDEZ</label>
                                <input type="text" name={"VALIDEZ"} onChange={handleEventChange} />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DATOS DE CLIENTE</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">NOMBRE</label>
                            <input type="text" name={"NOMBRE"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CORREO</label>
                            <input type="text" name={"CORREO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">EMPRESA</label>
                            <input type="text" name={"EMPRESA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">TELEFONO</label>
                            <input type="text" name={"TELEFONO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CARGO</label>
                            <input type="text" name={"CARGO"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">CIUDAD</label>
                            <input type="text" name={"CIUDAD"} onChange={handleEventChange} />
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DESCRIPCION DE SERVICIO</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">NÚMERO DE SERVICIO</label>
                            <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
                        </div>
                        
                        <div>
                            <label htmlFor="">MONEDA</label>
                            <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">MERCANCÍA</label>
                            <input type="text" name={"PESO TN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">TIPO DE CAMBIO</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">TIPO DE CARGA</label>
                            <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
                        </div>
                        
                        <div>
                            <label htmlFor="">CONDICIONES DE PAGO</label>
                            <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">TIPO DE SERVICIO</label>
                            <input type="text" name={"PESO TN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CONTRATO/COTIZACIÓN</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>
                        
                    </div>
                    <br />

                    
                    <div className={style.subtitle}>DESCRPCION DE LA CARGA<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>

                    <div className={`${style.containerFirstItems2} ${style.desktop}`}>
                        <span>Nº</span>
                        <span>ITEM</span>
                        <span>DESCRIPCION</span>
                        <span>MARCA Y/O PRESINTO</span>
                        <span>CANT</span>
                        <span>PESO (Kg)</span>
                        <span>VOLUMEN (M3)</span>
                        <span>DIRECCION DE ENTREGA</span>
                    </div>
                    {
                        tarifa.map((i, index) => {
                            return (
                                <div className={`${style.inputs}`} key={index}>
                                    <input type="text" placeholder="Nº" />
                                    <input type="text" placeholder="ITEM" />
                                    <input type="text" placeholder="DESCRIPCION" />
                                    <input type="text" placeholder="MARCA Y/O PRESINTO" />
                                    <input type="number" name={`CANTIDAD${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="CANTIDAD" />
                                    <input type="number" name={`PESO${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="PESO (Kg)" />
                                    <input type="number" name={`VOLUMEN${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="VOLUMEN (M3)" />
                                    <input type="text" placeholder="DIRECCION DE ENTREGA" />
                                </div>
                            )
                        })
                    }
                    <div className={`${style.inputs}`} >
                        <span className={style.total}>TOTAL</span>
                        <span className={style.span}>{counter && counter.cantidad && counter.cantidad}</span>
                        <span className={style.span}>{counter && counter.peso && counter.peso}</span>
                        <span className={style.span}>{counter && counter.volumen && counter.volumen}</span>
                    </div>
                    <br />
  

                </form>
            </div>
            <button className={style.downloadPDF} onClick={handlerPdfButton}>
                <Image src="/download-pdf.svg" width="50" height="50" alt="User" />
            </button>
            <br />
            <br />
        </Layout>
    )
}

export default WithAuth(CotizacionTerrestre) 
