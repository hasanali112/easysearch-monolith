import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class Blog extends BaseEntity {
  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @Property({ nullable: true, type: 'string' })
  featuredImage?: string;

  @Property({ nullable: true, type: 'string' })
  author?: string;

  @Property({ type: 'json', nullable: true })
  tags?: string[];

  @Property({ default: false, type: 'boolean' })
  isPublished: boolean = false;

  @Property({ nullable: true, type: 'date' })
  publishedAt?: Date;

  @Property({ default: 0, type: 'number' })
  views: number = 0;
}
