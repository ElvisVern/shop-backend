import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { v4 as uuid } from "uuid";
import Good from 'App/Models/Good';
import Database from '@ioc:Adonis/Lucid/Database';
import apiResponse from 'App/Services/ApiResponse';
import { ActionResult } from '../Enums';
import { CreateGoodsValidator } from 'App/Validators/GoodsValidator';
import UtilService from 'App/Services/UtilService';
import RedisService from 'App/Services/RedisService';

export default class GoodsController {
  /**
   * 新增商品
   */
  public async add({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateGoodsValidator);
    const result = await Good.query().where({ name: data.name });
    if (result.length > 0) return apiResponse(response, '商品已存在！');

    const good = new Good();
    good.name = data.name;
    good.goodsId = uuid();
    good.goodsDesc = data.desc;
    good.price = +data.price;
    good.primaryPicUrl = data.primary_pic_url;
    good.stock = +data.stock;
    good.createdAt = UtilService.getUnixTimeNow();

    await good.save();
    // 更新Redis库存
    await RedisService.updateStock(good.goodsId, good.stock);
    return apiResponse(response, ActionResult.Success);
  }

  /**
   * 删除商品 
   */
  public async delete({ request, response }: HttpContextContract) {
    const id = request.input('id');
    if (!id) return apiResponse(response, 'goods id required');
    await Good.query().where({ id }).delete();
    return apiResponse(response, ActionResult.Success);
  }

  /**
   * 管理端查看商品
   */
  public async list({ request, response }: HttpContextContract) {
    const page = request.input('page', 1);
    const name = request.input('filter')
    // 限制最多10条
    const limit = 10;
    const query = Database.from('goods');
    if (name) {
      query.where({ name });
    }
    const data = await query.paginate(page, limit);
    return apiResponse(response, data);
  }
}
