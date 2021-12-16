import * as React from 'react';
import { CreateExport } from '../../helpers/Export';
import { getPayloadAsJson } from '../../helpers/Token';

function UserPortalSettings() {
    const user = getPayloadAsJson();

    return(
        <div>test</div>
    );
}

export default CreateExport('/user-portal-settings', UserPortalSettings);