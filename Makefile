types:
	cd libs/types && rushx build

cl: client
client:
	cd apps/client && rushx dev

sv: server
server:
	cd apps/server && rushx start:dev
