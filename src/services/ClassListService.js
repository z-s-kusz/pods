import Vue from 'vue';

const setClassList = function(classList) {
  store.classList = classList;
};

const initializeClassListFromLocalStorage = function() {
  const classList = [];
  const classStorageIdsJSON = localStorage.getItem('classStorageIds');
  if (classStorageIdsJSON) {
    const classStorageIds = JSON.parse(classStorageIdsJSON);
    classStorageIds.forEach(id => {
      const myClassJSON = localStorage.getItem(id);
      const myClass = JSON.parse(myClassJSON);
      classList.push(myClass);
    });
    setClassList(classList);
  }
};

const updateClass = function(updateClass) {
  let index = 0;
  store.classList.find((myClass, i) => {
    if (myClass.myClassId === updateClass.myClassId) {
      index = i;
      return true
    }
  });
  store.classList.splice(index, 1, updateClass);
};

const store = Vue.observable({
  classList: [],
});

export default {
  store,
  setClassList,
  initializeClassListFromLocalStorage,
  updateClass,
}
