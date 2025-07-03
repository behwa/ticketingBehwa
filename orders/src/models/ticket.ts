import mongoose from "mongoose";
// import { OrderStatus } from "@behwatickets/common";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    version?: number; // optional
    // userId: string; 
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    // userId: string; 
    isReserved(): Promise<boolean>;

}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
        // ,
        // userId: {
        //     type: String,
        //     required: true
        // }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre('save', function(done){
//     // @ts-ignore
//     this.$where = {
//         version: this.get('version') - 1
//     };
// })


ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version -1
    })
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    const ticketData: any = {
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
        // ,
        // userId: attrs.userId
    };

    if (attrs.version !== undefined) {
        ticketData.version = attrs.version;
    }

    return new Ticket(ticketData);
};

// why add in function key word ??
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserve on'
    const existingOrder = await Order.findOne({ 
            ticket: this,
            status: {
                    $in: [
                            OrderStatus.Created,
                            OrderStatus.AwaitingPayment,
                            OrderStatus.Complete
                    ]
            }

    })
    return !!existingOrder; // if null --- become true then false
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
