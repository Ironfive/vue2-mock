const MixSelect = {
    props: {
        value: {
            type: String | Number,
            default: null
        },
        valueKey: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        filterable: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        width: {
            type: String,
            default: '100%'
        },
    },
    computed: {
        selectValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    data() {
        return {
            optionsList: [],
            loading: false
        }
    },
    methods: {
        selectChange(val) {
            this.$emit('on-select-change', val);
        },
        selectClear() {
            this.$emit('on-clear', val);
        }
    }
}