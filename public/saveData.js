const Store = require("electron-store");
const storage = new Store();

function getData(type) {
    const users = storage.get(type);

    if (users) return users;
    else {
        storage.set(type, []);
        return [];
    }
}

function savingData(data, type) {
    // storage.delete(type); // Remove this line when building Production
    storage.set(type, data);
}

function deleteuser(type) {
    storage.delete(type);
}

module.exports = {
    getData: getData,
    savingData: savingData,
    deleteuser: deleteuser,
};
