//status code
export const InvoiceStatus = {
    DRAFT: 'LightGrey',
    GENERATED: 'DeepSkyBlue',
    INVOICED: 'Coral',
    SETTLED: 'green',
    CANCELLED:'Red',
}

export const InvoiceEvent = {
    FINALISE: 'FINALISE',
    REVISE: 'REVISE',
    INVOICE: 'INVOICE',
    PAID: 'PAID',
    CANCEL:'CANCEL',
}

export const DoStatus = {
    DRAFT: 'LightGrey',
    GENERATED: 'DeepSkyBlue',
    TRANSIT: 'Coral',
    DELIVERED: 'green',
    CANCELLED:'Red',
}

export const DoEvent = {
    FINALISE: 'FINALISE',
    REVISE: 'REVISE',
    SHIP: 'SHIP',
    RECEIVE: 'RECEIVE',
    CANCEL:'CANCEL',
}

export const PDFFormats = [
    {name: 'style_1', value: "template_001"},
    {name: 'style_2', value: "template_002"},
]
