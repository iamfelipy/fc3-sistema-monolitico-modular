import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { CreateInvoiceFacadeInputDto, CreateInvoiceFacadeOutputDto, FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./invoice.facade.interface";


export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _generateInvoiceUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._generateInvoiceUsecase = usecaseProps.addUsecase;
  }

  async create(input: CreateInvoiceFacadeInputDto): Promise<CreateInvoiceFacadeOutputDto> {
    const output = await this._generateInvoiceUsecase.execute(input);

    return {
      id: output.id,
      items: output.items,
      total: output.total
    }
  }
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}