import { useEffect } from 'react';

import { GetTenantId } from 'aas/common/functions';
import { useState } from 'react';
import TenantCreate from 'aas/views/TenantCreate';
import DashboardOverview from 'app/views/dashboard/DashboardOverview';

// ==============================|| Home ||============================== //
const Home = () => {
    // console.log('Home')
    const [create, setCreate] = useState(false);

    useEffect(() => {
        var tid = GetTenantId()
        if (tid !== null && tid !== undefined && Number(tid) === 0) {
            setCreate(true)
        }
    }, [setCreate]);

    return (
        <>
            {create ? <TenantCreate /> :
                <DashboardOverview />
            }
        </>

    );
};

export default Home;
