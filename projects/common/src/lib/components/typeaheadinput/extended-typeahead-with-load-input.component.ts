import {catchError, map, mergeMap} from 'rxjs/operators';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {defer, Observable, of} from 'rxjs';
import {ExtendedTypeaheadWithLoadDirective} from './extended-typeahead-with-load.directive';
import {ExtendedTypeaheadInputComponent} from './extended-typeahead-input.component';
import {DomSanitizer} from '@angular/platform-browser';
import {TypeaheadContainerComponent, TypeaheadMatch} from 'ngx-bootstrap/typeahead';
import {isDefined} from "../../helpers/object.helper";
import {escapeRegExp} from "../../helpers/string.helper";

@Component({
  standalone: false,
    selector: 'app-extended-typeahead-with-load-input',
    templateUrl: './extended-typeahead-with-load-input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ExtendedTypeaheadWithLoadInputComponent),
            multi: true
        },
        ExtendedTypeaheadWithLoadDirective
    ],
    styleUrls: ['./extended-typeahead-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ExtendedTypeaheadWithLoadInputComponent extends ExtendedTypeaheadInputComponent implements ControlValueAccessor, OnInit {
    @Input() pageableSource: (text: string, page: number) => Observable<any>;
    @Input() labelFormatter: (value: any, level?: number) => string;

    @ViewChild('typeaheadDirective', {static: true}) _typeahead: ExtendedTypeaheadWithLoadDirective;
    searchFieldValue;
    page = 0;

    @Input() offset: (value: any) => string = (model) => model.level;



    constructor(protected cd: ChangeDetectorRef,
                private sanitizer: DomSanitizer,
                protected renderer: Renderer2) {
        super(cd, renderer);
    }

    public get container(): TypeaheadContainerComponent {
        return this._typeahead._container;
    }

    get loadMoreObject() {
        const loadMoreObject = {_loadMore: true};
        loadMoreObject[this.searchProperty] = null;
        return loadMoreObject;
    }

    ngOnInit(): void {
        this.dataSource$ = defer(
            () => of(this.searchString))
            .pipe(
                mergeMap((token: string) => this.pageableSource(token, this.page)
                    .pipe(catchError((e) => of(e)))
                    .pipe(map(result => {
                        if (result.totalElements == 0) {
                            return [this.noMatchObject];
                        }
                        const flatContent = this.makeContentFlat(result.content)
                        if (this.page < result.totalPages - 1) {
                            flatContent.push(this.loadMoreObject);
                        }
                        this.loading = false;
                        this.cd.detectChanges();
                        return flatContent;
                    }))));

        this.resultFormatter = this.resultFormatter || this.listFormatter;
        this.searchResultObject = null;
    }

    onSelect(e: TypeaheadMatch) {
        if (!e.item || !e.item._loadMore) {
            const selected = e.item && !e.item._noMatch ? e.item : null;
            this.writeValue(selected);
            this.selectItem.emit(selected);
            this.showFormattedStringInInputField();
            this.focusNext();
        }
        this.loading = false;
        this.cd.detectChanges();
    }

    onTouched(event) {
        this.externalOnTouched(event.target.value);
    }

    onChange(e) {
        this.externalOnChange(e);
        this.change.emit(e);
    }

    onLoadMore() {
        this.page++;
        this.subscriptions.add(
            this.dataSource$.subscribe((matches: TypeaheadMatch[]) => {
                this._typeahead.addMatches(matches);
                this.cd.detectChanges();
            }));
    }

    selectMatch(match, e) {
        if (match && match.item && match.item._loadMore) {
            this.onLoadMore();
            e.cancelBubble = true;
            e.preventDefault();
        } else {
            this.container.selectMatch(match);
        }
        this.cd.detectChanges();
    }


    showSearchStringInInputField() {
        this.page = 0;
        super.showSearchStringInInputField();
    }

    styleListFormatter(model, query) {
        const formattedListValue = this.listFormatter(model) || '';

        const reg = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
        return this.sanitizer.bypassSecurityTrustHtml(formattedListValue.replace(reg, '<b>$1</b>'));
    }

    makeContentFlat(content, level?: number) {
        const result = [];
        if (isDefined(content) && content.length > 0) {
            content.forEach(item => {
                item.level = level || 0;
                result.push(item);
                if (isDefined(item.children)) {
                    result.push(...this.makeContentFlat(item.children, item.level + 1));
                }
            });
        }
        return result;
    }


}
