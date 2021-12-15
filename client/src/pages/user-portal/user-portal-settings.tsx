import * as React from 'react';
import { CreateExport } from '../../helpers/Export';
import { getPayloadAsJson, getToken } from '../../helpers/Token';
const user = getPayloadAsJson();

function UserPortalSettings() {
    console.log(user);
    return(
        <div>test</div>
    );
}

export default CreateExport('/user-portal-settings', UserPortalSettings);