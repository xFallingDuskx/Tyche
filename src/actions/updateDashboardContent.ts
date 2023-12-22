import { FirebaseError } from 'firebase/app'
import { User } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { db } from '../firebase/config'


export default async function updateDashboardContent(currentUser: User, dashboardId: string, header:string, subheader:string, color: string, content:any[]) {
    let result = null, error = null
    if (currentUser) {
        try {
            const pathRef = ref(db, 'users/' + currentUser.uid + `/dashboards/${dashboardId}`)
            await set(pathRef, {
                header: header,
                subheader: subheader,
                color: color,
                content: content,
            })
            result = 'success'
        } catch (e) {
            error = e as FirebaseError
        }
    }

    return { result, error }
}
