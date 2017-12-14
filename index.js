var store = {
	save (key,value) {
		localStorage.setItem(key,JSON.stringify(value));
	},
	get (key) {
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var STORAGE_NAME = '__vue-todos__';

var list = store.get(STORAGE_NAME);

if (window.location.hash === '') {
	window.location.hash = '#all';
}

var vm = new Vue({
	el: ".main",
	created () {
		this.has = window.location.hash.slice(1);
		this.watchList();
	},
	data () {
		return {
			list,
			addTitle: '',
			currentList: [],
			has: '',
		}
	},
	computed: {
		unfinished: function(){
			return this.list.filter((item) => {
				return item.isCheck === false;
			}).length
		}
	},
	methods: {
		deleteItem (item) {
			// console.log(id);
			var index = this.list.findIndex(function (a) {
				return item === a;
			})
			this.list.splice(index, 1);
			// console.log(index);
			// this.list.forEach(function (item, index, arr) {
			// 	console.log(item.id === id)
			// 	if (item.id === id) {
			// 		arr.splice(index, 1);
			// 	}
			// })
		},
		editing (index) {
			this.list[index].editing = true;
			setTimeout(() => {
				var el = this.$refs.item[index].getElementsByClassName('edit')[0];
				setTimeout(() => {
					el.focus();
				}, 20)
			}, 20)
		},
		confirmTitle (item) {
			if (item.newTitle === '') {
				this.cancelEditing(item);
				return;
			}
			item.title = item.newTitle;
			item.editing = false;
			item.newTitle = '';
		},
		cancelEditing (item) {
			item.editing = false;
			item.newTitle = '';
		},
		addItem (ev) {
			if (this.addTitle === '') {
				ev.target.blur();
				return;
			}
			this.list.push({
				title: this.addTitle,
				isCheck: false,
				editing: false,
				newTitle: '',
				id: Math.random()
			})
			this.addTitle = '';
			ev.target.blur();
		},
		cancelAddItem () {
			this.addTitle = '';
			this.$refs.addItemInput.blur();
		},
		watchList() {
			if (this.has === 'all') {
				this.currentList = this.list.slice(0);
			} else if (this.has === 'unfinished') {
				this.currentList = this.list.filter((item) => {
					return item.isCheck === false;
				});
			} else {
				this.currentList = this.list.filter((item) => {
					return item.isCheck === true;
				});
			}
		}
	},
	watch: {
		list: {
			handler: function () {
				this.watchList();
				store.save('__vue-todos__', list);
			},
			deep: true
		},
		has() {
			this.watchList();
		}
	}
})

function getHash() {
	vm.has = window.location.hash.slice(1);
}
getHash();
window.addEventListener("hashchange",() => {
	getHash()
});
