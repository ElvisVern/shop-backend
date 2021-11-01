import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class CreateGoodsValidator {
  public schema = schema.create({
    name: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.minLength(1),
      rules.maxLength(20),
    ]),
    desc: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.minLength(1),
      rules.maxLength(20),
    ]),
    price: schema.number([
      rules.required(),
      rules.range(0.01, 99999)
    ]),
    primary_pic_url: schema.string({ trim: true, escape: true }, [
      rules.required()
    ]),
    stock: schema.number([
      rules.required(),
      rules.range(1, 99999)
    ]),
  })
  public messages = {
    'name.required': '商品名称必填.',
    'desc.required': '商品描述必填.',
    'price.number': '商品价格必须在0.01-99999之间',
    'primary_pic_url.required': '图片链接地址必填.',
    'stock.required': '库存数量必填.',
  }
}