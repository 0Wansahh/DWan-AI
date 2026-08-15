-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('IDR', 'USD');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark');

-- CreateEnum
CREATE TYPE "Horizon" AS ENUM ('1h', '6h', '1d', '7d');

-- CreateEnum
CREATE TYPE "Trend" AS ENUM ('bullish', 'bearish', 'sideways');

-- CreateEnum
CREATE TYPE "RoleChat" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('lstm', 'transformer', 'hybrid');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'IDR',
    "theme" "Theme" NOT NULL DEFAULT 'light',
    "price_alert_high" DECIMAL(18,2),
    "price_alert_low" DECIMAL(18,2),
    "default_predict_horizon" "Horizon" NOT NULL DEFAULT '1d',
    "notification_email" BOOLEAN NOT NULL DEFAULT true,
    "notification_browser" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BitcoinPrice" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(18,2) NOT NULL,
    "high" DECIMAL(18,2) NOT NULL,
    "low" DECIMAL(18,2) NOT NULL,
    "close" DECIMAL(18,2) NOT NULL,
    "volume" DECIMAL(24,4) NOT NULL,
    "market_cap" DECIMAL(24,2) NOT NULL,
    "source" VARCHAR(50) NOT NULL,

    CONSTRAINT "BitcoinPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "model_version_id" UUID NOT NULL,
    "predict_horizon" "Horizon" NOT NULL,
    "predicted_price" DECIMAL(18,2) NOT NULL,
    "confidence_score" DECIMAL(5,4) NOT NULL,
    "trend" "Trend" NOT NULL,
    "explanation_text" TEXT NOT NULL,
    "actual_price" DECIMAL(18,2),
    "accuracy" DECIMAL(5,4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "role" "RoleChat" NOT NULL,
    "content" TEXT NOT NULL,
    "context_price" DECIMAL(18,2),
    "model_used" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelVersion" (
    "id" UUID NOT NULL,
    "version_name" VARCHAR(50) NOT NULL,
    "model_type" "ModelType" NOT NULL,
    "huggingface_model_id" VARCHAR(200),
    "training_dataset_start" DATE NOT NULL,
    "training_dataset_end" DATE NOT NULL,
    "mape_score" DECIMAL(6,4),
    "accuracy_score" DECIMAL(5,4),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "model_file_path" TEXT,
    "trained_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingLog" (
    "id" UUID NOT NULL,
    "model_version_id" UUID NOT NULL,
    "epoch" INTEGER NOT NULL,
    "train_loss" DECIMAL(10,6) NOT NULL,
    "val_loss" DECIMAL(10,6) NOT NULL,
    "learning_rate" DECIMAL(10,8) NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_user_id_key" ON "UserSettings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BitcoinPrice_timestamp_key" ON "BitcoinPrice"("timestamp");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_model_version_id_fkey" FOREIGN KEY ("model_version_id") REFERENCES "ModelVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelVersion" ADD CONSTRAINT "ModelVersion_trained_by_fkey" FOREIGN KEY ("trained_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingLog" ADD CONSTRAINT "TrainingLog_model_version_id_fkey" FOREIGN KEY ("model_version_id") REFERENCES "ModelVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
