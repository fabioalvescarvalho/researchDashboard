import studiesComponent from './study/studiesComponent';
import studyComponent from './study/studyComponent';
import poolComponent from './pool/poolComponent';
import historyComponent from './pool/historyComponent';
import downloadsComponent from './downloads/downloadsComponent';
import downloadsAccessComponent from './downloadsAccess/downloadsAccessComponent';
import loginComponent from './login/loginComponent';
export default routes;

let routes = {
	'/login': loginComponent,
	'/studies' : studiesComponent,
	'/editor/:studyId': studyComponent,
	'/editor/:studyId/:resource/:fileID': studyComponent,
	'/pool': poolComponent,
	'/pool/history': historyComponent,
	'/downloads': downloadsComponent,
	'/downloadsAccess': downloadsAccessComponent
};

