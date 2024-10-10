export const Orders: Record<string, { color: string, label: string }> = {
    pay: {color: '#ABABAB', label: '待支付'},
    shipment: {color: '#88DCFF', label: '待发货'},
    receipt: {color: '#109AD4', label: '待收货'},
    evaluate: {color: '#FF8B4D', label: '待评价'},
    completed: {color: '#75CD42', label: '已完结'},
    closed: {color: '#525252', label: '已关闭'},
}