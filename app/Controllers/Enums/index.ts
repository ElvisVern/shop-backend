export enum ActionResult {
  Success = 'Success',
  Failed = 'Failed',
}

export enum OrderStatusEnum {
  /**
   * 新申请
   */
  REQUESTED = 0,
  /**
   * 支付成功
   */
  SUCCESSED = 1,
  /**
   * 支付失败
   */
  FAILED = 2
}