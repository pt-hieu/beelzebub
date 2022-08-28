t: types
types:
	cd libs/types && rushx build

cl: client
client:
	cd apps/client && rushx dev

tc: tauri-client
tauri-client:
	cd apps/client && rushx tauri dev

sv: server
server:
	cd apps/server && rushx start:dev

pg: postgres
postgres:
	docker exec -it postgres psql -U postgres -d beelzebub

isv: install-server
install-server:
	cd apps/server && rush add -p ${1} ${2}

icl: install-client
install-client:
	cd apps/client && rush add -p ${1} ${2}