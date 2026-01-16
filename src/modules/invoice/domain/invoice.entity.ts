import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice-items.entity";
import Address from "./value-object/address.value-object";

type InvoiceProps = {
  id?: Id;
  name: string
  document: string
  address: Address 
  items: InvoiceItem[] 
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: InvoiceItem[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  total() {
    return this.items.reduce((pv, cv) => pv + cv.price, 0);
  }

  private validate() {
    if (!this._name || this._name.trim() === "") {
      throw new Error("Name is required");
    }

    if (!this._document || this._document.trim() === "") {
      throw new Error("Document is required");
    }

    if (!this._address) {
      throw new Error("Address is required");
    }

    if (!Array.isArray(this._items) || this._items.length === 0) {
      throw new Error("Invoice must have at least one item");
    }

    for (const item of this._items) {
      if (typeof item.price !== "number" || item.price <= 0) {
        throw new Error("Each item must have a positive price");
      }
    }

    // Check for duplicate items by id (assuming unique item id)
    const ids = this._items.map(item => item.id.id);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new Error("Duplicate items are not allowed in the invoice");
    }
  }
}