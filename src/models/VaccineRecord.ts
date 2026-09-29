import mongoose, { Schema, Document } from "mongoose";

interface IVaccineRecord extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  /** 关联剂次标识（如 "hepb-1"），自由补录时为空 */
  doseKey?: string; // 剂次标识
  /** 疫苗名称（冗余存储，不依赖模板） */
  vaccineName: string; // 疫苗名称
  /** 第几剂 */
  dose?: number; // 第几剂
  /** 实际接种日期 */
  injectDate: Date; // 接种日期
  /** 接种单位 */
  hospital?: string; // 接种单位
  /** 疫苗批号 */
  batchNo?: string; // 疫苗批号
  /** 费用（元），自费时有意义 */
  fee?: number; // 费用（元）
  /** 备注 */
  note?: string; // 备注
}

// 创建模型
const vaccineRecordSchema = new Schema<IVaccineRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户id
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 关联宝宝ID
    doseKey: { type: String }, // 关联剂次标识（自由补录时为空）
    vaccineName: { type: String, required: true }, // 疫苗名称
    dose: { type: Number, min: 1 }, // 第几剂
    injectDate: { type: Date, required: true }, // 接种日期
    hospital: { type: String }, // 接种单位
    batchNo: { type: String }, // 疫苗批号
    fee: { type: Number, min: 0 }, // 费用（元）
    note: { type: String }, // 备注
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

// 按babyId查询某个宝宝的接种记录，并按接种日期倒序排列
vaccineRecordSchema.index({ babyId: 1, injectDate: -1 });

export default mongoose.model<IVaccineRecord>(
  "VaccineRecord",
  vaccineRecordSchema,
  "vaccineRecord",
);
