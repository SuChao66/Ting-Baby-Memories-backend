import mongoose, { Schema, Document } from "mongoose";
// 导入常量
import {
  SYMPTOM_RECORD_TYPES,
  SYMPTOM_OPTIONS,
  MEDICATION_USAGE_TYPES,
} from "@/enums";

/** 症状护理类型 */
export type SymptomRecordType =
  (typeof SYMPTOM_RECORD_TYPES)[keyof typeof SYMPTOM_RECORD_TYPES];

interface ISymptomRecord extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  type: SymptomRecordType; // 记录类型
  startTime?: Date; // 记录时间
  remark?: string; // 备注
  /** 体温 */
  temperature?: number; // 体温值 ℃
  /** 症状 */
  symptoms?: string[]; // 症状列表（多选）
  /** 用药 */
  medicineType?: string; // 药品使用类型：internal-内服 / external-外用
  medicineName?: string; // 药品名称
  dosage?: string; // 用药剂量
  /** 看医生 */
  hospital?: string; // 就诊医院
  department?: string; // 就诊科室
  doctor?: string; // 就诊医生
  diagnosis?: string; // 就诊原因/诊断
  advice?: string; // 医生建议
  /** 备忘 */
  content?: string; // 备忘内容
}

// 创建模型
const symptomRecordSchema = new Schema<ISymptomRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户id
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 关联宝宝ID
    type: { type: String, enum: SYMPTOM_RECORD_TYPES, required: true }, // 记录类型
    startTime: { type: Date }, // 记录时间
    remark: { type: String }, // 备注
    /** 体温 */
    temperature: { type: Number }, // 体温值 ℃
    /** 症状 */
    symptoms: {
      type: [String],
      enum: SYMPTOM_OPTIONS, // 每个症状值需在枚举内
      default: undefined,
    }, // 症状列表（多选）
    /** 用药 */
    medicineType: {
      type: String,
      enum: MEDICATION_USAGE_TYPES, // 药品使用类型
    }, // internal-内服 / external-外用
    medicineName: { type: String }, // 药品名称
    dosage: { type: String }, // 用药剂量
    /** 看医生 */
    hospital: { type: String }, // 就诊医院
    department: { type: String }, // 就诊科室
    doctor: { type: String }, // 就诊医生
    diagnosis: { type: String }, // 就诊原因/诊断
    advice: { type: String }, // 医生建议
    /** 备忘 */
    content: { type: String }, // 备忘内容
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

// 按babyId查询某个宝宝的记录，并按startTime倒序排列
symptomRecordSchema.index({ babyId: 1, startTime: -1 });

export default mongoose.model<ISymptomRecord>(
  "SymptomRecord",
  symptomRecordSchema,
  "symptomRecord",
);
