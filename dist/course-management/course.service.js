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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("./course.schema");
let CourseService = class CourseService {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async createCourse(createCourseDto) {
        const newCourse = await this.courseModel.create(createCourseDto);
        return newCourse;
    }
    async getAllCourses() {
        return this.courseModel.find().exec();
    }
    async updateCourse(courseId, updateCourseDto) {
        const course = await this.courseModel.findOne({ courseId });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        const newVersion = {
            version: `v${course.versions.length + 1}`,
            content: { ...course.toObject() },
            updatedAt: new Date(),
        };
        course.versions.push(newVersion);
        Object.assign(course, updateCourseDto);
        return course.save();
    }
    async revertToVersion(courseId, version) {
        try {
            const course = await this.courseModel.findOne({ courseId });
            if (!course) {
                throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
            }
            const versionData = course.versions.find((v) => v.version === version);
            if (!versionData) {
                throw new common_1.NotFoundException(`Version ${version} not found for course ${courseId}.`);
            }
            console.log('Reverting to version data:', versionData);
            const restoredContent = { ...versionData.content };
            delete restoredContent.versions;
            Object.assign(course, restoredContent);
            course.versions.push({
                version: `v${course.versions.length + 1}`,
                content: { ...restoredContent },
                updatedAt: new Date(),
            });
            return course.save();
        }
        catch (error) {
            console.error('Error in revertToVersion:', error.message);
            throw new common_1.InternalServerErrorException(`Failed to revert course version: ${error.message}`);
        }
    }
    async getVersions(courseId) {
        const course = await this.courseModel.findOne({ courseId });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        return course.versions.map(({ version, updatedAt }) => ({ version, updatedAt }));
    }
    async addMultimedia(courseId, multimediaUrl) {
        const course = await this.courseModel.findOne({ courseId });
        if (!course)
            throw new Error('Course not found');
        course.multimedia.push(multimediaUrl);
        return course.save();
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CourseService);
//# sourceMappingURL=course.service.js.map