export class BaseResponse<T = unknown> {
  /**
   * giá trị true : thành công - false : thất bại
   */
  isSuccess: boolean;

  /**
   * mã kết quả trả về
   */
  statusCode: number;

  /**
   * thông tin phản hồi
   */
  message: string;

  /**
   * đối tượng trả về
   */
  result?: T;

  /**
   * thông tin lỗi nếu thất bại
   */
  error?: unknown;

  constructor() {
    this.statusCode = 200;
    this.isSuccess = true;
    this.message = "";
  }
}
