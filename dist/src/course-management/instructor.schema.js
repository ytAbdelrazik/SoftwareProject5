"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorSchema = exports.Instructor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const users_schema_1 = require("../user-managment/users.schema");
let Instructor = class Instructor extends users_schema_1.User {
};
exports.Instructor = Instructor;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Instructor.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Instructor.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Instructor.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Instructor.prototype, "passwordHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], Instructor.prototype, "expertise", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: [] }),
    __metadata("design:type", Array)
], Instructor.prototype, "createdCourses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Instructor.prototype, "createdAt", void 0);
exports.Instructor = Instructor = __decorate([
    (0, mongoose_1.Schema)()
], Instructor);
exports.InstructorSchema = mongoose_1.SchemaFactory.createForClass(Instructor);
//# sourceMappingURL=instructor.schema.js.map