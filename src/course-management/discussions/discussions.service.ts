import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discussion } from './discussions.schema';
import { Comment } from './comments.schema';
import { Course } from 'src/course-management/course.schema';
import { NotificationService } from 'src/notifications/notifications.service';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<Discussion>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private readonly notificationService: NotificationService, // Inject NotificationService
  ) {}

  private async validateCourse(courseId: string): Promise<void> {
    const course = await this.courseModel.findOne({ courseId }).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} does not exist.`);
    }
  }

  private validateUserAccess(role: string, allowedRoles: string[]): void {
    if (!allowedRoles.includes(role)) {
      throw new UnauthorizedException(`You are not authorized to perform this action.`);
    }
  }

  async getDiscussionsByCourse(courseId: string): Promise<Discussion[]> {
    await this.validateCourse(courseId);
    return this.discussionModel.find({ courseId }).sort({ createdAt: -1 }).exec();
  }

  async createDiscussion(
    courseId: string,
    userId: string,
    role: string,
    content: string,
  ): Promise<Discussion> {
    await this.validateCourse(courseId);
    this.validateUserAccess(role, ['instructor', 'student']);

    const newDiscussion = new this.discussionModel({ courseId, userId, role, content });
    const savedDiscussion = await newDiscussion.save();

    // Notify students and instructors
    await this.notificationService.createNotification(
      courseId,
      `A new forum discussion has been created in course ${courseId}.`,
      'announcement',
    );

    return savedDiscussion;
  }

  async editDiscussion(
    forumId: string,
    userId: string,
    role: string,
    newContent: string,
  ): Promise<Discussion> {
    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }

    if (forum.userId !== userId && role !== 'instructor') {
      throw new UnauthorizedException(`You are not authorized to edit this forum.`);
    }

    forum.content = newContent;
    return forum.save();
  }

  async deleteDiscussion(forumId: string, userId: string, role: string): Promise<void> {
    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }

    if (forum.userId !== userId && role !== 'instructor') {
      throw new UnauthorizedException(`You are not authorized to delete this forum.`);
    }

    await this.discussionModel.deleteOne({ _id: forumId }).exec();
  }

  async getCommentsByForum(forumId: string): Promise<Comment[]> {
    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }
    return this.commentModel.find({ forumId }).sort({ createdAt: -1 }).exec();
  }

  async createComment(
    forumId: string,
    userId: string,
    role: string,
    content: string,
  ): Promise<Comment> {
    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }

    const newComment = new this.commentModel({ forumId, userId, role, content });
    const savedComment = await newComment.save();

    // Notify forum owner
    await this.notificationService.createNotification(
      forum.userId,
      `A new comment has been added to your forum post.`,
      'comment',
    );

    return savedComment;
  }

  async editComment(
    commentId: string,
    userId: string,
    role: string,
    newContent: string,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} does not exist.`);
    }

    if (comment.userId !== userId && role !== 'instructor') {
      throw new UnauthorizedException(`You are not authorized to edit this comment.`);
    }

    comment.content = newContent;
    return comment.save();
  }

  async deleteComment(commentId: string, userId: string, role: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} does not exist.`);
    }

    if (comment.userId !== userId && role !== 'instructor') {
      throw new UnauthorizedException(`You are not authorized to delete this comment.`);
    }

    await this.commentModel.deleteOne({ _id: commentId }).exec();
  }
}
