import contextMenu from 'utils/contextMenuComponent';
import messages from 'utils/messagesComponent';
import downloadUrl from 'utils/downloadUrl';
import {createDir, createEmpty, moveFile, copyUrl} from './fileActions';
import {createFromTemplate} from './wizardActions';
import wizardHash from './wizardHash';
export default fileContext;


let fileContext = (file, study) => {
    let path = !file ? '/' : file.isDir ? file.path : file.basePath;
    let isReadonly = study.isReadonly;
    let menu = [];

    if (!isReadonly) {
        menu = menu.concat([
            {icon:'fa-folder', text:'New Directory', action: createDir(study, path)},
            {icon:'fa-file', text:'New File', action: createEmpty(study, path)},
            {icon:'fa-file-text', text:'New from template', menu: mapWizardHash(wizardHash)},
            {icon:'fa-magic', text:'New from wizard', menu: [
                {text: 'Rating wizard', action: activateWizard(`rating`)}
            ]}
        ]);
    }
     
    // Allows to use as a button without a specific file
    if (file) {
        let isExpt = /\.expt\.xml$/.test(file.name);

        if (!isReadonly) menu.push({separator:true});

        menu = menu.concat([
            {icon:'fa-refresh', text: 'Refresh/Reset', action: refreshFile, disabled: isReadonly || file.content() == file.sourceContent()},
            {icon:'fa-download', text:'Download', action: downloadFile},
            {icon:'fa-link', text: 'Copy URL', action: copyUrl(file.url)},
            isExpt ?  { icon:'fa-play', href:`https://app-prod-03.implicit.harvard.edu/implicit/Launch?study=${file.url.replace(/^.*?\/implicit/, '')}`, text:'Play this task'} : '',
            isExpt ? {icon:'fa-link', text: 'Copy Launch URL', action: copyUrl(`https://app-prod-03.implicit.harvard.edu/implicit/Launch?study=${file.url.replace(/^.*?\/implicit/, '')}`)} : '',
            {icon:'fa-close', text:'Delete', action: deleteFile, disabled: isReadonly },
            {icon:'fa-exchange', text:'Move/Rename...', action: moveFile(file,study), disabled: isReadonly }
        ]);
    }

    return contextMenu.open(menu);

    function activateWizard(route){
        return () => m.route(`/editor/${study.id}/wizard/` + route);
    }
    
    function mapWizardHash(wizardHash){
        return Object.keys(wizardHash).map((text) => {
            let value = wizardHash[text];
            return typeof value === 'string'
                ? {text, action: createFromTemplate({study, path, url:value, templateName:text})}
                : {text, menu: mapWizardHash(value)};
        });
    }

    function refreshFile(){
        file.content(file.sourceContent());
        m.redraw();
    }

    function downloadFile(){
        return downloadUrl(file.url, file.name);
    }

    function deleteFile(){
        messages.confirm({
            header:['Delete ',m('small', file.name)],
            content: 'Are you sure you want to delete this file? This action is permanent!'
        })
        .then(ok => {
            if (ok) return study.del(file.id);
        })
        .then(m.redraw)
        .catch( err => {
            err.response.json()
                .then(response => {
                    messages.alert({
                        header: 'Delete failed:',
                        content: response.message
                    });
                });
            return err;
        });
    } // end delete file
};