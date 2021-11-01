import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderId: string

  @column()
  public goodsId: string

  @column()
  public userId: string

  @column()
  public orderStatus: number

  @column()
  public payStatus: number

  @column()
  public address: string

  @column()
  public mobile: string

  @column()
  public orderPrice: number

  @column()
  public createdAt: number

  @column()
  public updatedAt: number
}
