import { useRouter } from 'next/router'
import Image from 'next/image'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'

import style from '../styles/Admin.module.css'

function Admin() {
    const { user } = useUser()
    const router = useRouter()


    return (
        <Layout>

            <div className={style.container}>
                <Image src="/logo.svg" width="350" height="250" alt="User" />
            </div>
            <div className={style.imgContainer}>
                Estamos trabajando...
            </div>        </Layout>

    )
}

export default WithAuth(Admin)