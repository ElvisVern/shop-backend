import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Good extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public goodsId: string

  @column()
  public goodsDesc: string

  @column()
  public price: number

  @column()
  public stock: number

  @column()
  public primaryPicUrl: string

  @column()
  public createdAt: number

  @column()
  public updatedAt: number
}
