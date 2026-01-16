import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { AddInvoiceFacadeInputDto, FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./invoice.facade.interface";


export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  async add(input: AddInvoiceFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}