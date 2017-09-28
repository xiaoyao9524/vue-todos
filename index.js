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
		deleteItem (index) {
			this.list.splice(index, 1);
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
		addItem () {
			if (this.addTitle === '') {
				return;
			}
			this.list.push({
				title: this.addTitle,
				isCheck: false,
				editing: false,
				newTitle: ''
			})
			this.addTitle = '';
		},
		cancelAddItem () {
			this.addTitle = '';
			this.$refs.addItemInput.blur();
		},
		watchList() {
			console.log('watch：');
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
			console.log('haschange')
			this.watchList();
		}
	}
})

function getHash() {
	vm.has = window.location.hash.slice(1);
	console.log(vm)
}
getHash();
window.addEventListener("hashchange",() => {
	console.log('haschange1');
	getHash()
});
