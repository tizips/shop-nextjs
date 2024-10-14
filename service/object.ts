export const Orders: Record<string, { color: string, label: string }> = {
    pay: {color: '#ABABAB', label: 'Pending Payment'},
    shipment: {color: '#88DCFF', label: 'Pending Shipment'},
    receipt: {color: '#109AD4', label: 'Pending Receipt'},
    received: {color: '#87d068', label: 'Received'},
    completed: {color: '#75CD42', label: 'Completed'},
    closed: {color: '#525252', label: 'Closed'},
}

export const Services: Record<string, { color?: string, label: string }> = {
    pending: {color: '#FF8B4D', label: 'Pending'},
    user: {color: '#88DCFF', label: 'Waiting for the user to ship'},
    org: {color: '#109AD4', label: 'Waiting for the seller to ship'},
    confirm_user: {color: '#ABABAB', label: 'Waiting for user confirmation'},
    confirm_org: {color: '#ABABAB', label: 'Waiting for seller confirmation'},
    finish: {color: '#75CD42', label: 'Completed'},
    closed: {color: '#525252', label: 'Closed'},
    agree: {color: '#75CD42', label: 'Agreed'},
    refuse: {color: '#f52', label: 'Rejected'},
    un_receipt: {color: '#FF8B4D', label: 'Not Received'},
    refund: {color: '#f52', label: 'Return and Refund'},
    exchange: {color: '#ABABAB', label: 'Exchange'},
}
